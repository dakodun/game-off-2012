/* **************************************************************** **
**	jsconcat - Concatenate multiple JavaScript files into one.
**	Copyright (c) 2012 Iain M. Crawford
**
**	This software is provided 'as-is', without any express or
**	implied warranty. In no event will the authors be held liable
**	for any damages arising from the use of this software.
**
**	Permission is granted to anyone to use this software for any
**	purpose, including commercial applications, and to alter it
**	and redistribute it freely, subject to the following
**	restrictions:
** 
**		1. The origin of this software must not be misrepresented;
**		   you must not claim that you wrote the original
**		   software. If you use this software in a product, an
**		   acknowledgment in the product documentation would be
**		   appreciated but is not required.
**
**		2. Altered source versions must be plainly marked as such,
**		   and must not be misrepresented as being the original
**		   software.
**
**		3. This notice may not be removed or altered from any
**		   source distribution.
** **************************************************************** */

#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <stdexcept>

// drink some beer
unsigned int DrinkBeer(unsigned int const & left) {
	if (left == 0) {
		std::cout << "Burp!" << std::endl << std::endl;
		return 0;
	}
	else {
		std::cout << "Glug glug..." << std::endl;
		return DrinkBeer(left - 1);
	}
}

// a javascript file
class JavaScriptFile {
	public :
		JavaScriptFile(std::string filename) {
			std::ifstream file;
			file.open(filename.c_str(), std::ios::in);
			
			try {
				std::string line;
				
				if (file.is_open()) {
					while (file.good()) {
						getline(file, line);
						
						mBuffer.push_back(line);
					}
					
					file.close();
				}
				else {
					throw std::runtime_error("unable to open the javascript file: " + filename);
				}
				
				if (mBuffer.back() != "") {
					mBuffer.push_back("");
				}
			} catch (std::exception& e) {
				std::cout << e.what() << std::endl;
				
				if (file.is_open()) {
					file.close();
				}
			}
		}
		
		~JavaScriptFile() {
			
		}
		
		std::vector<std::string> mBuffer; // contents of the javascript files
	private :
		
};

int main (int argc, char *argv[]) {
	DrinkBeer(2);
	int exitCode = 0;
	
	std::string confFile = "conf";
	if (argc == 2) {
		confFile = argv[1];
		std::cout << "Attempting to use the config file: " << confFile << "." << std::endl;
	}
	else {
		std::cout << "No config file passed, attempting to use the default: \"conf\"." << std::endl;
	}
	
	std::cout << "Beginning concatenation process..." << std::endl;
	
	std::string outFile; // output file
	std::vector<std::string> inFiles; // input files
	
	{
		// open config file for reading (file that contains list of input files and output file location)
		std::ifstream conf;
		conf.open(confFile.c_str(), std::ios::in);
		
		try {
			std::string line; // getline
			
			// if file opened properly
			if (conf.is_open()) {
				// whilst the files is still open and available for reading
				while (conf.good()) {
					getline(conf, line); // get next line
					
					// if not blank line then assume input file
					if (line != "") {
						inFiles.push_back(line);
					}
				}
				
				conf.close(); // close file
			}
			else {
				throw std::runtime_error("unable to open the the config file: conf");
			}
		} catch (std::exception& e) {
			std::cout << e.what() << std::endl;
			
			// clean up file properly
			if (conf.is_open()) {
				conf.close();
			}
		}
	}
	
	std::vector<std::string> jsOutBuffer; // buffer for our final output
	
	{
		outFile = inFiles.back(); // output file is last file read in
		inFiles.pop_back(); // remove output file from input files
		
		std::cout << "Retrieved input files: ";
		for (unsigned int i = 0; i < inFiles.size(); ++i) {
			std::cout << inFiles.at(i);
			
			if (i != inFiles.size() - 1) {
				if (i != inFiles.size() - 2) {
					std::cout << ", ";
				}
				else {
					std::cout << " and ";
				}
			}
		}
		std::cout << "." << std::endl;
		
		// loop all input files
		for (unsigned int i = 0; i < inFiles.size(); ++i) {
			JavaScriptFile jsf(inFiles.at(i)); // read content of js file into buffer
			jsOutBuffer.insert(jsOutBuffer.end(), jsf.mBuffer.begin(), jsf.mBuffer.end());
		}
	}
	
	{
		// open output file for output (out final js file)
		std::ofstream output;
		output.open(outFile.c_str(), std::ios::out);
		
		try {
			// if file opened properly
			if (output.is_open()) {
				// whilst the files is still open and available for reading
				for (unsigned int i = 0; i < jsOutBuffer.size(); ++i) {
					output << jsOutBuffer.at(i) << std::endl;
				}
				
				output.close(); // close file
			}
			else {
				throw std::runtime_error("unable to open the the output file: " + outFile);
			}
		} catch (std::exception& e) {
			std::cout << e.what() << std::endl;
			
			// clean up file properly
			if (output.is_open()) {
				output.close();
			}
		}
	}
	
	std::cout << "Successfully concatenated all input files into output file " + outFile + "!" << std::endl;
	
	// Pause the console so we can see any output before quitting
	std::string pause;
    std::cout << "\nEnter to continue..." << std::endl;
    std::getline(std::cin, pause);

	return exitCode; // Exit
}

